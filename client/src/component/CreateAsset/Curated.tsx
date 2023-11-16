import { useQuery } from '@apollo/client';
import { FeaturedPublicAnimations } from '../../repo/graph';
import { lottieClient } from '../../service/apolloClient';
import { Button, Card, CardActions, CardContent, CardMedia, Skeleton } from '@mui/material';

export const Curated = (props: { onChooseJSONUrl: (jsonUrl: string, slugName: string) => void }) => {

  const { data, loading } = useQuery(FeaturedPublicAnimations, {
    client: lottieClient,
    fetchPolicy: 'cache-first',
  })

  return (
    <>
      <div className="flex items-center border-b-2 mt-2">
        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Get the best from LottieFiles Featured Public Animation</h3>
      </div>
      <div className='h-[60vh] lg:h-[70vh] overflow-y-auto'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 pt-4'>
          {loading && <>
            {(new Array(8)).fill(true).map((_, idx) => (
              <Skeleton key={idx} variant="rounded" width={210} height={60} />
            ))}
          </>}
          {!loading && data.featuredPublicAnimations.edges.map((edge: any) => (
            <Card
              key={edge.node.id} sx={{ maxWidth: 345 }}
              onClick={() => props.onChooseJSONUrl(edge.node.jsonUrl, edge.node.slug)}>
              <CardMedia
                sx={{ height: 140 }}
                image={edge.node.imageUrl}
                title={edge.node.name}
              />
              <CardContent>
                <div className='text-left text-xs md:text-sm lg:text-base mb-2'>
                  {edge.node.name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}