import { useQuery } from '@tanstack/react-query';
import { AdminArtistService } from '@/services/admin/artist.service';

export function usePendingArtists() {
    return useQuery({
        queryKey: ['admin', 'artists', 'pending'],
        queryFn: () => AdminArtistService.getPendingArtists(),
        refetchOnWindowFocus: false,
    });
}
