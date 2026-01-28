import { toast } from "sonner"
import { CircleCheck, CircleX } from 'lucide-react'

export const copyCoverLetter = async (text: string) => {
    try {
        navigator.clipboard.writeText(text)
        toast(
            <div className="flex items-center gap-2">
                <CircleCheck size={18} className="text-black bg-green-300 rounded-full" />
                <span>Copied Successfully</span>
            </div>
            , {
            unstyled: true,
            className: 'bg-green-200 text-black p-2 rounded',
            duration: 5000,
        })
    } catch (error) {
        console.log(error)
        
        toast(
            <div className="flex items-center gap-2">
                <CircleX size={18} className="text-black bg-red-300 rounded-full" />
                <span>Failed to Copy</span>
            </div>
            , {
            unstyled: true,
            className: 'bg-red-200 text-black p-2 rounded',
            duration: 5000,
        })
    }
}