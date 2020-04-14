import uid from 'uid';

export function addToast(toasts:any[], title:string, color:string, text:string | JSX.Element, icon:string)  {
  const toast = {
    title: title,
    color: color,
    text: text,
    iconType: icon,
    id: uid(),
  };
  return (
    toasts = toasts.concat(toast)
  )
};

export function removeToast(toasts:any[], removedToast: { id: string; }) {
  return(
    toasts = toasts.filter(toast => toast.id !== removedToast.id)
  )
};
