import { Card, CardContent, CardDescription, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaStar } from "react-icons/fa";

type Prop = {
    name?: string;
    testimony?: string;
    role?: string
}

function defaultAvatar (name : string):string{
    const names = name.split(" ")
    return names[0][0].toUpperCase() + names[1][0].toUpperCase()
}

const TestimonialCard = (prop: Prop) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardDescription className='flex flex-row text-[yellow]'>
                        <FaStar size={18} />
                        <FaStar size={18} />
                        <FaStar size={18} />
                        <FaStar size={18} />
                        <FaStar size={18} />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-[14px]">{prop.testimony} </p>
                    <div className='flex items-center gap-2 mt-3'>
                        <Avatar>
                            <AvatarImage src="" alt="@shadcn" />
                            <AvatarFallback className='bg-black text-white'>{defaultAvatar(prop.name!)} </AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{prop.name}</p>
                            <small>{prop.role} </small>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default TestimonialCard