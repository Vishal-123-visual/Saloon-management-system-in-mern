'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CustomAdapter } from '../../../auth/adapters/custome-adapter';

export default function UpdateUserRole() {
  const { id } = useParams(); // user id from URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  // ✅ Load user details first
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await CustomAdapter.userDetails(id); // you may need to add this in adapter
        setUser(data);
        setRole(data.role);
      } catch (err) {
        toast.error('Failed to load user');
      }
    }
    fetchUser();
  }, [id]);

  // ✅ Update only role
  const handleUpdate = async () => {
    try {
      const result = await CustomAdapter.updateUser(id, { role });
      if (result) {
        //toast.success('User role updated');
        navigate('/store-admin/all-user'); // redirect back to list
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Something went wrong',err);
    }
  };

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Update Role for {user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>User Email</Label>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <Label>Select Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
