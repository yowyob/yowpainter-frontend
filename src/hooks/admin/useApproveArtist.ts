import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminArtistService } from '@/services/admin/artist.service';
import type { ApproveArtistRequest, ApproveArtistMfaResponse } from '@/types/admin';

export function useApproveArtist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            artistId,
            request,
        }: {
            artistId: string;
            request?: ApproveArtistRequest | null;
        }): Promise<ApproveArtistMfaResponse> => {
            return await AdminArtistService.approveArtist(artistId, request);
        },
        onSuccess: (data) => {
            if (data.status === 'ACTIVE') {
                queryClient.invalidateQueries({ queryKey: ['admin', 'artists', 'pending'] });
            }
        },
    });
}
