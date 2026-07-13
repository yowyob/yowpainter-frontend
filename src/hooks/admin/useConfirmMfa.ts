import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminArtistService } from '@/services/admin/artist.service';
import type { ApproveArtistMfaRequest, ApproveArtistMfaResponse } from '@/types/admin';

export function useConfirmMfa() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            artistId,
            request,
        }: {
            artistId: string;
            request: ApproveArtistMfaRequest;
        }): Promise<ApproveArtistMfaResponse> => {
            return await AdminArtistService.confirmApproveArtist(artistId, request);
        },
        onSuccess: (data) => {
            if (data.status === 'ACTIVE') {
                queryClient.invalidateQueries({ queryKey: ['admin', 'artists', 'pending'] });
            }
        },
    });
}
