import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

type Prop = {
    title?: string;
    bodyText?: string;
    icon?: ReactNode
}

const CardComponent = (prop: Prop) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardDescription>{prop.icon}</CardDescription>
                    <CardTitle className="heading_font text-[16px]">{prop.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-[14px]">{prop.bodyText} </p>
                </CardContent>
               
            </Card>
        </>
    )
}

export default CardComponent