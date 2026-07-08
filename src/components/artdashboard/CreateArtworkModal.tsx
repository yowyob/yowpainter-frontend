"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Camera, X, Loader2, Plus, Trash2 } from "lucide-react";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { ArtworkCreateRequest } from "@/lib/models/ArtworkCreateRequest";
import { getApiErrorMessage } from "@/lib/api-error-handler";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";

interface CreateArtworkModalProps {
  onClose: () => void;
  artworkToEdit?: any; // If provided, we are in edit mode
}

export default function CreateArtworkModal({ onClose, artworkToEdit }: CreateArtworkModalProps) {
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState(artworkToEdit?.title || "");
  const [description, setDescription] = useState(artworkToEdit?.description || "");
  const [technique, setTechnique] = useState<ArtworkCreateRequest.technique>(
    artworkToEdit?.technique || "OIL"
  );
  const [style, setStyle] = useState<ArtworkCreateRequest.style>(
    artworkToEdit?.style || "ABSTRACT"
  );
  const [dimensions, setDimensions] = useState(artworkToEdit?.dimensions || "");
  const [tags, setTags] = useState<string[]>(artworkToEdit?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  interface UploadedMedia {
    id: string;
    type: 'image' | 'video';
    file?: File;
    preview: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    url?: string;
    isNew: boolean;
  }

  const [mediaList, setMediaList] = useState<UploadedMedia[]>(() => {
    const list: UploadedMedia[] = [];
    if (artworkToEdit?.imageUrls) {
      artworkToEdit.imageUrls.forEach((url: string, i: number) => {
        list.push({
          id: `img-${i}`,
          type: 'image',
          preview: url,
          progress: 100,
          status: 'completed',
          url: url,
          isNew: false
        });
      });
    }
    if (artworkToEdit?.videoUrls) {
      artworkToEdit.videoUrls.forEach((url: string, i: number) => {
        list.push({
          id: `vid-${i}`,
          type: 'video',
          preview: url,
          progress: 100,
          status: 'completed',
          url: url,
          isNew: false
        });
      });
    }
    return list;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!artworkToEdit;

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      // Cleanup object URLs to avoid memory leaks
      mediaList.forEach(m => {
        if (m.isNew && m.preview.startsWith('blob:')) {
          URL.revokeObjectURL(m.preview);
        }
      });
    };
  }, []);

  const startUpload = async (mediaId: string, file: File, type: 'image' | 'video') => {
    try {
      if (type === 'image') {
        const res = await ArtworksService.uploadArtworkImageWithProgress(file, (percent) => {
          setMediaList(prev => prev.map(m => m.id === mediaId ? { ...m, progress: percent } : m));
        });
        if (!res.imageUrl) throw new Error("Upload response was empty");
        setMediaList(prev => prev.map(m => m.id === mediaId ? { ...m, status: 'completed', progress: 100, url: res.imageUrl } : m));
      } else {
        const res = await ArtworksService.uploadArtworkVideoWithProgress(file, (percent) => {
          setMediaList(prev => prev.map(m => m.id === mediaId ? { ...m, progress: percent } : m));
        });
        if (!res.videoUrl) throw new Error("Upload response was empty");
        setMediaList(prev => prev.map(m => m.id === mediaId ? { ...m, status: 'completed', progress: 100, url: res.videoUrl } : m));
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err, type === 'image' ? "Upload Image" : "Upload Vidéo");
      setMediaList(prev => prev.map(m => m.id === mediaId ? { ...m, status: 'error' } : m));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImagesCount = mediaList.filter(m => m.type === 'image').length;
    if (currentImagesCount + files.length > 5) {
      toast.error("Limite atteinte", "Maximum 5 images autorisées.");
      return;
    }

    files.forEach(file => {
      const mediaId = `new-img-${Math.random().toString(36).substr(2, 9)}`;
      const preview = URL.createObjectURL(file);
      
      const newMedia: UploadedMedia = {
        id: mediaId,
        type: 'image',
        file,
        preview,
        progress: 0,
        status: 'uploading',
        isNew: true
      };

      setMediaList(prev => [...prev, newMedia]);
      startUpload(mediaId, file, 'image');
    });

    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentVideosCount = mediaList.filter(m => m.type === 'video').length;
    if (currentVideosCount + files.length > 3) {
      toast.error("Limite atteinte", "Maximum 3 vidéos autorisées.");
      return;
    }

    const allowedExtensions = ['mp4', 'mov', 'webm', 'ogg'];
    const maxBytes = 50 * 1024 * 1024; // 50MB

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedExtensions.includes(ext)) {
        toast.error("Format non supporté", "Veuillez choisir un fichier MP4, MOV, WEBM ou OGG.");
        return;
      }
      if (file.size > maxBytes) {
        toast.error("Fichier trop lourd", "Les vidéos doivent faire moins de 50 Mo.");
        return;
      }
    }

    files.forEach(file => {
      const mediaId = `new-vid-${Math.random().toString(36).substr(2, 9)}`;
      const preview = URL.createObjectURL(file);

      const newMedia: UploadedMedia = {
        id: mediaId,
        type: 'video',
        file,
        preview,
        progress: 0,
        status: 'uploading',
        isNew: true
      };

      setMediaList(prev => [...prev, newMedia]);
      startUpload(mediaId, file, 'video');
    });

    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeMedia = (id: string) => {
    setMediaList(prev => {
      const item = prev.find(m => m.id === id);
      if (item && item.isNew && item.preview.startsWith('blob:')) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter(m => m.id !== id);
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const isAnyUploading = mediaList.some(m => m.status === 'uploading');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls = mediaList.filter(m => m.type === 'image' && m.status === 'completed').map(m => m.url!);
    const videoUrls = mediaList.filter(m => m.type === 'video' && m.status === 'completed').map(m => m.url!);

    if (imageUrls.length === 0) {
      setError("Une image est requise pour l'œuvre.");
      return;
    }

    if (isAnyUploading) {
      setError("Veuillez attendre la fin des uploads en cours.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody: ArtworkCreateRequest = {
        title,
        description: description.trim() || undefined,
        technique,
        style,
        dimensions: dimensions.trim() || undefined,
        tags,
        imageUrls,
        videoUrls,
      };

      if (isEditMode) {
        await ArtworksService.updateArtwork(artworkToEdit.id, requestBody);
        toast.success("Œuvre mise à jour !", "Les modifications ont été enregistrées.");
      } else {
        const newArtwork = await ArtworksService.createArtwork(requestBody);
        if (newArtwork.id) {
          await ArtworksService.updateStatus(newArtwork.id, 'PUBLISHED');
        }
        toast.success("Œuvre créée !", "Votre nouvelle œuvre est maintenant en ligne.");
      }

      queryClient.invalidateQueries({ queryKey: ["artist-works"] });
      onClose();
    } catch (err: any) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(err, isEditMode ? "Mise à jour de l'œuvre" : "Création de l'œuvre");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
        onClick={onClose}
      />
      <div className="relative z-10 bg-background w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row h-full md:h-[85vh] max-h-[90vh]">
        
        {/* Left Side: Media Upload & Previews */}
        <div className="w-full md:w-1/2 bg-foreground/5 relative flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">
          
          {/* Section: Images */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-foreground/45 uppercase tracking-[0.2em]">Images (Max 5)</label>
              <button 
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={mediaList.filter(m => m.type === 'image').length >= 5}
                className="text-xs text-accent font-medium hover:underline disabled:opacity-30 disabled:no-underline"
              >
                + Ajouter des images
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {mediaList.filter(m => m.type === 'image').map((media) => (
                <div key={media.id} className="relative aspect-square bg-foreground/5 rounded-xl overflow-hidden border border-foreground/10 group">
                  <Image src={media.preview} alt="Artwork Preview" fill className="object-cover" />
                  
                  {/* Progress overlay */}
                  {media.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest mb-1.5 text-center">Upload...</span>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-300" style={{ width: `${media.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-mono mt-1">{media.progress}%</span>
                    </div>
                  )}

                  {/* Error overlay */}
                  {media.status === 'error' && (
                    <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-red-200 text-center">
                      <span className="text-[10px] font-bold uppercase mb-1">Échec</span>
                      <button 
                        type="button" 
                        onClick={() => media.file && startUpload(media.id, media.file, 'image')}
                        className="text-[9px] underline uppercase tracking-wider font-semibold hover:text-white"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}

                  {/* Hover Delete Action */}
                  {media.status !== 'uploading' && (
                    <button 
                      type="button"
                      onClick={() => removeMedia(media.id)}
                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              
              {mediaList.filter(m => m.type === 'image').length === 0 && (
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="col-span-3 border-2 border-dashed border-foreground/10 hover:border-accent hover:bg-accent/5 rounded-xl aspect-[3/1] flex flex-col items-center justify-center cursor-pointer transition-all text-foreground/40 gap-1.5"
                >
                  <Plus size={20} />
                  <span className="text-xs font-medium">Ajouter une image</span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Vidéos */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-foreground/45 uppercase tracking-[0.2em]">Vidéos (Max 3)</label>
              <button 
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={mediaList.filter(m => m.type === 'video').length >= 3}
                className="text-xs text-accent font-medium hover:underline disabled:opacity-30 disabled:no-underline"
              >
                + Ajouter des vidéos
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mediaList.filter(m => m.type === 'video').map((media) => (
                <div key={media.id} className="relative aspect-video bg-black rounded-xl overflow-hidden border border-foreground/10 group">
                  <video 
                    src={media.preview} 
                    className="w-full h-full object-cover" 
                    preload="metadata" 
                    playsInline 
                    muted 
                  />
                  
                  {/* Progress overlay */}
                  {media.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest mb-1.5 text-center">Upload Vidéo...</span>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-300" style={{ width: `${media.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-mono mt-1">{media.progress}%</span>
                    </div>
                  )}

                  {/* Error overlay */}
                  {media.status === 'error' && (
                    <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-red-200 text-center">
                      <span className="text-[10px] font-bold uppercase mb-1">Échec</span>
                      <button 
                        type="button" 
                        onClick={() => media.file && startUpload(media.id, media.file, 'video')}
                        className="text-[9px] underline uppercase tracking-wider font-semibold hover:text-white"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}

                  {/* Hover Delete Action */}
                  {media.status !== 'uploading' && (
                    <button 
                      type="button"
                      onClick={() => removeMedia(media.id)}
                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              {mediaList.filter(m => m.type === 'video').length === 0 && (
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className="col-span-2 border-2 border-dashed border-foreground/10 hover:border-accent hover:bg-accent/5 rounded-xl aspect-[4/1] flex flex-col items-center justify-center cursor-pointer transition-all text-foreground/40 gap-1.5"
                >
                  <Plus size={20} />
                  <span className="text-xs font-medium">Ajouter une vidéo</span>
                </div>
              )}
            </div>
          </div>

          <input 
            type="file" 
            ref={imageInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            multiple
            className="hidden" 
          />
          <input 
            type="file" 
            ref={videoInputRef} 
            onChange={handleVideoChange} 
            accept="video/*" 
            multiple
            className="hidden" 
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden bg-background">
          <div className="px-8 py-6 border-b border-foreground/10 flex items-center justify-between shrink-0">
            <h2 className="font-serif text-2xl font-semibold">{isEditMode ? "Éditer l'œuvre" : "Nouvelle œuvre"}</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Titre de l'œuvre</label>
              <input 
                required
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-3 outline-none focus:border-accent transition-colors text-xl font-serif"
                placeholder="Ex: L'Âme du Sahel"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-4 outline-none focus:border-accent transition-colors text-sm font-light resize-none"
                placeholder="Décrivez l'histoire derrière cette pièce..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Technique</label>
                <select 
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value as any)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                >
                  <option value="OIL">Huile</option>
                  <option value="ACRYLIC">Acrylique</option>
                  <option value="WATERCOLOR">Aquarelle</option>
                  <option value="GOUACHE">Gouache</option>
                  <option value="PASTEL">Pastel</option>
                  <option value="CHARCOAL">Fusain</option>
                  <option value="PENCIL">Crayon</option>
                  <option value="MIXED_MEDIA">Technique Mixte</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Style</label>
                <select 
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                >
                  <option value="ABSTRACT">Abstrait</option>
                  <option value="FIGURATIVE">Figuratif</option>
                  <option value="PORTRAIT">Portrait</option>
                  <option value="LANDSCAPE">Paysage</option>
                  <option value="STILL_LIFE">Nature Morte</option>
                  <option value="SURREALISM">Surréalisme</option>
                  <option value="IMPRESSIONISM">Impressionnisme</option>
                  <option value="POP_ART">Pop Art</option>
                  <option value="CONTEMPORARY">Contemporain</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Dimensions</label>
              <input 
                type="text" 
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                placeholder="Ex: 80 x 120 cm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-[11px] rounded-full border border-accent/20">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><X size={10} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-4 py-2 text-xs outline-none focus:border-accent transition-colors"
                  placeholder="Ajouter un tag..."
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </form>

          <div className="p-8 border-t border-foreground/10 flex gap-4 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-foreground/20 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={(e) => handleSubmit(e as any)}
              disabled={loading || isAnyUploading}
              className="flex-[2] py-4 px-6 bg-ink text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-xl hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAnyUploading ? "Upload en cours..." : (isEditMode ? "Mettre à jour" : "Publier l'œuvre"))}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
