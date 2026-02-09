import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {
  LogIn
} from 'lucide-react';

function LoginRequiredToCommentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
            Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
          You need to login before you can react to news articles.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild className="bg-neutral-700">
            <a href="/login">
              <LogIn />
              Login
            </a>
          </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LoginRequiredToCommentDialog;