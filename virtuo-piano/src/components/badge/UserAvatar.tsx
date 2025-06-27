import * as Avatar from '@radix-ui/react-avatar';

export default function UserAvatar({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  return (
    <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-10 h-10 rounded-full bg-slate-200">
      <Avatar.Image
        className="h-full w-full object-cover"
        src={image || ''}
        alt={name}
      />
      <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-sm font-medium">
        {name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
