import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { RestaurantStory } from '@/components/restaurant/story';
import { OpeningHours } from '@/components/restaurant/opening-hours';
import { SocialLinks } from '@/components/restaurant/social-links';
import { ContactCard } from '@/components/restaurant/contact-card';

export default function AboutPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="About the restaurant"
          description="Learn how the branded customer experience supports menu browsing, loyalty, games, and rewards."
        >
          <ButtonLink href="/menu" variant="secondary">
            Explore menu
          </ButtonLink>
        </PageHeader>
      </Container>
      <RestaurantStory />
      <OpeningHours />
      <SocialLinks />
      <ContactCard />
    </>
  );
}
