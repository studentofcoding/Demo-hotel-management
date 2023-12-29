import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "SUCCESS" | "ERROR";
    onClose: () => void;
}

const Toast = ({message,type,onClose}:ToastProps) => {      //here we are creating a component called Toast and passing the props to it

    useEffect(() => {         //here we are using the useEffect hook to remove the toast after 5 seconds
        const timer = setTimeout(() => {
           onClose();
        }, 5000);
        return () =>{
            clearTimeout(timer);
        };
    },[onClose]);   

    const styles = type === "SUCCESS"      //here we are checking if the type is SUCCESS or ERROR and assigning the styles accordingly
      ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md";

    return(
        <div className={styles}>
            <div className="flex justify-center items-center">
                <span className="text-lg font-semibold">
                    {message}
                </span>
            </div>
        </div>
    )
}   

export default Toast;