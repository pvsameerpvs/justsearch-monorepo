"use client";

import { Container } from '@/components/shared/container';
import { ProfileHeaderCard } from '@/components/restaurant/profile/profile-header-card';
import { ProfileMenuList } from '@/components/restaurant/profile/profile-menu-list';

export default function ProfilePage() {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
          <ProfileHeaderCard />
          <ProfileMenuList />
        </div>
      </Container>
    </section>
  );
}
