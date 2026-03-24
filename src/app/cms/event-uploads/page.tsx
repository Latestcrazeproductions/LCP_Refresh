import { getSiteContent } from '@/lib/content';
import EventUploadsClient from '@/components/EventUploadsClient';

export default async function EventUploadsPage() {
  const content = await getSiteContent();
  const eventTypes = content?.eventTypes?.items ?? [];

  return <EventUploadsClient eventTypes={eventTypes} />;
}
