import { Button, Card, CardHeader, CardTitle, CardContent, PageHeader } from '@justsearch/ui';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <PageHeader title="JustSearch Super Admin" description="Platform-wide management foundation">
        <Button>Create Restaurant</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Restaurants Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 italic">No restaurants registered yet. Foundation ready.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
