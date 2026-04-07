import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { ContactCard } from '@/components/restaurant/contact-card';
import { OpeningHours } from '@/components/restaurant/opening-hours';
import { SocialLinks } from '@/components/restaurant/social-links';

export default function ContactPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Contact"
          description="Reach the restaurant through the public profile, then check in once you are on site."
        >
          <ButtonLink href="/live" variant="secondary">
            Open live route
          </ButtonLink>
        </PageHeader>
      </Container>
      <ContactCard />
      <OpeningHours />
      <SocialLinks />
    </>
  );
}

