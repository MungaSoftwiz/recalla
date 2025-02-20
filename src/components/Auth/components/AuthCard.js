import { Card, CardHeader, CardTitle, CardContent } from '@/components/Auth/components/ui/card';
import { AutoAwesomeIcon } from 'lucide-react';

export function AuthCard({ title, children }) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <AutoAwesomeIcon className="h-10 w-10 text-[#9C55FF]" />
        </div>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}