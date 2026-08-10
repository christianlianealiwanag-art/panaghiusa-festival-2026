import { redirect } from "next/navigation";

export default function AdminIndex(){
  // send to login
  redirect('/admin/login');
}
