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

function LoginRequiredToReactDialog({ userReaction, count }:
  { userReaction: string, count: number }) {
  const wording = userReaction == 'like' ? [ 'Like', 'Likes' ] : [ 'Dislike', 'Dislikes' ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={ `${userReaction == 'like' ? 'border-r rounded-l-full' : 'border-l rounded-r-full'} text-gray-700 bg-gray-200 hover:bg-gray-100 flex flex-row gap-1 flex-nowrap justify-start items-center border-white px-2` }
          type="button">
          <span>{ count }</span>
          <span>{ count == 1 ? wording[0] : wording[1] }</span>
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

export default LoginRequiredToReactDialog;