import { Button, Card, CardHeader, CardTitle, CardContent, PageHeader } from '@justsearch/ui';

export default function Dashboard() {
  return (
    <div className="p-8">
      <PageHeader title="Restaurant Partner Dashboard" description="Manage your restaurant activity foundation">
        <Button variant="outline">Preview Profile</Button>
        <Button>Update Menu</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </CardContent>
        </Card>
        {/* Additional metric cards placeholder */}
      </div>
    </div>
  );
}
