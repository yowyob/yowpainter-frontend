'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Camera, X, Loader2, Plus, Film, ImageIcon } from 'lucide-react'
import { ActuService } from '@/lib/services/ActuService'
import { ActuCreateRequest } from '@/lib/models/ActuCreateRequest'
import { ActuResponse } from '@/lib/models/ActuResponse'
import { FilesService } from '@/lib/services/FilesService'
import { getApiErrorMessage } from '@/lib/api-error-handler'
import { toast } from '@/lib/toast'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface CreateActuModalProps {
  onClose: () => void
  actuToEdit?: ActuResponse | null
}

export default function CreateActuModal({ onClose, actuToEdit }: CreateActuModalProps) {
  const t = useTranslations('Dashboard')
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  const [title, setTitle] = useState(actuToEdit?.title || '')
  const [comment, setComment] = useState(actuToEdit?.comment || '')
  const [mediaType, setMediaType] = useState<ActuCreateRequest.mediaType>(
    actuToEdit?.mediaType || ActuCreateRequest.mediaType.IMAGE
  )

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(actuToEdit?.imageUrl || null)
  const [videoPreview, setVideoPreview] = useState<string | null>(actuToEdit?.videoUrl || null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!actuToEdit
  const isVideo = mediaType === ActuCreateRequest.mediaType.VIDEO

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleMediaTypeChange = (type: ActuCreateRequest.mediaType) => {
    setMediaType(type)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      setError(t('actuCommentRequired'))
      return
    }

    if (!isEditMode) {
      if (isVideo && !videoFile) {
        setError(t('actuVideoRequired'))
        return
      }
      if (!isVideo && !imageFile) {
        setError(t('actuImageRequired'))
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      let finalImageUrl = actuToEdit?.imageUrl || undefined
      let finalVideoUrl = actuToEdit?.videoUrl || undefined

      if (imageFile) {
        const res = await FilesService.uploadFile({ file: imageFile }, "ACTU_MEDIA")
        finalImageUrl = res.imageUrl || undefined
      }

      if (videoFile) {
        const res = await FilesService.uploadFile({ file: videoFile }, "ACTU_MEDIA")
        finalVideoUrl = res.imageUrl || undefined
      }

      const requestBody: ActuCreateRequest = {
        title: title.trim() || undefined,
        comment: comment.trim(),
        imageUrl: finalImageUrl,
        videoUrl: isVideo ? finalVideoUrl : undefined,
        mediaType,
      }

      if (isEditMode && actuToEdit?.id) {
        await ActuService.updateActu(actuToEdit.id, requestBody)
        toast.success(t('actuUpdatedToast'), t('actuUpdatedDesc'))
      } else {
        await ActuService.createActu(requestBody)
        toast.success(t('actuCreatedToast'), t('actuCreatedDesc'))
      }

      queryClient.invalidateQueries({ queryKey: ['artist-actu'] })
      if (user?.slug) {
        queryClient.invalidateQueries({ queryKey: ['artist-public-actu', user.slug] })
      }
      onClose()
    } catch (err: unknown) {
      const message = getApiErrorMessage(err)
      setError(message)
      toast.error(err, isEditMode ? t('actuUpdateError') : t('actuCreateError'))
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row h-full md:h-[85vh] max-h-[90vh] relative z-10">

        {/* Média */}
        <div className="w-full md:w-2/5 bg-foreground/5 relative flex flex-col border-b md:border-b-0 md:border-r border-foreground/10">
          <div className="flex border-b border-foreground/10">
            <button
              type="button"
              onClick={() => handleMediaTypeChange(ActuCreateRequest.mediaType.IMAGE)}
              className={cn(
                'flex-1 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors',
                !isVideo ? 'bg-accent/10 text-accent' : 'text-foreground/40 hover:text-foreground/60'
              )}
            >
              <ImageIcon size={14} /> {t('image')}
            </button>
            <button
              type="button"
              onClick={() => handleMediaTypeChange(ActuCreateRequest.mediaType.VIDEO)}
              className={cn(
                'flex-1 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors',
                isVideo ? 'bg-accent/10 text-accent' : 'text-foreground/40 hover:text-foreground/60'
              )}
            >
              <Film size={14} /> {t('video')}
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
            {isVideo ? (
              videoPreview ? (
                <div className="relative w-full h-full group">
                  <video src={videoPreview} className="w-full h-full object-cover" controls />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="p-2 bg-white text-ink rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Film size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="flex flex-col items-center gap-4 cursor-pointer hover:text-accent transition-colors p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div>
                    <p className="font-serif text-base font-medium">{t('actuUploadVideo')}</p>
                    <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-widest">{t('actuVideoHint')}</p>
                  </div>
                </div>
              )
            ) : imagePreview ? (
              <div className="relative w-full h-full group">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-3 bg-white text-ink rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center gap-4 cursor-pointer hover:text-accent transition-colors p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center">
                  <Plus size={24} />
                </div>
                <div>
                  <p className="font-serif text-base font-medium">{t('actuUploadImage')}</p>
                  <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-widest">{t('actuImageHint')}</p>
                </div>
              </div>
            )}
          </div>

          {isVideo && (
            <div className="p-4 border-t border-foreground/10">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors"
              >
                {imagePreview ? t('actuChangePoster') : t('actuAddPoster')}
              </button>
            </div>
          )}

          <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          <input type="file" ref={videoInputRef} onChange={handleVideoChange} accept="video/*" className="hidden" />
        </div>

        {/* Formulaire */}
        <div className="w-full md:w-3/5 flex flex-col h-full bg-background">
          <div className="px-8 py-6 border-b border-foreground/10 flex items-center justify-between shrink-0">
            <h2 className="font-serif text-xl font-semibold">
              {isEditMode ? t('editActuTitle') : t('createActuTitle')}
            </h2>
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
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">
                {t('actuTitleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-lg font-serif"
                placeholder={t('actuTitlePlaceholder')}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">
                {t('actuCommentLabel')} *
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-3 outline-none focus:border-accent transition-colors text-sm font-light resize-none"
                placeholder={t('actuCommentPlaceholder')}
              />
            </div>
          </form>

          <div className="p-8 border-t border-foreground/10 flex gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-foreground/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={(e) => handleSubmit(e as React.FormEvent)}
              disabled={loading}
              className="flex-[2] py-3 px-4 bg-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-ink transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditMode ? t('save') : t('actuCreateBtn'))}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
