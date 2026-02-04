import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    z
} from "zod"
import {
    toast
} from "sonner"
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError
} from "@/components/ui/field"
import {
    Button
} from "@/components/ui/button"
import {
    Input
} from "@/components/ui/input"
import { Form } from "@/components/ui/form"
import { Link } from "react-router-dom"
import axios from 'axios';
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react"
import { CircleCheck, CircleX } from "lucide-react"

const formSchema = z.object({
    fullname: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name is too long")
        .optional(),
    email: z.string()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password is too long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [password, setPassword] = useState("")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            const url = 'https://cover-letter-builder.onrender.com/auth/signup'
            const response = await axios.post(url, values , {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(response)
            localStorage.setItem("token", response.data.token)
            toast(
                <div className="flex items-center gap-2">
                    <CircleCheck size={18} className="text-black bg-green-300 rounded-full" />
                    <span>{response.data.message}</span>
                </div>
                , {
                    unstyled: true,
                    className: 'bg-green-200 text-black p-2 rounded',
                    duration: 5000,
                }
            )
            window.location.href = "/complete-profile"

        } catch (error: any) {
            console.error("Form submission error", error);
            toast(
                <div className="flex items-center gap-2">
                    <CircleX size={18} className="text-black bg-red-300 rounded-full" />
                    <span>{error.response.data.message}</span>
                </div>
                , {
                    unstyled: true,
                    className: 'bg-red-200 text-black p-2 rounded',
                    duration: 5000,
                }
            )
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className='w-full min-h-screen relative bg-[url(/grid.png)] bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8'>
            {/* overlay */}
            <div className='absolute inset-0 bg-black/60 w-full'></div>
            <div className='relative z-10 w-full bg-white max-w-[400px] mx-auto p-7 rounded'>
                <h3 className="text-black text-2xl text-center pb-2">Create Account</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mx-auto text-black">
                        <Field>
                            <FieldLabel htmlFor="email">Fullname</FieldLabel>
                            <Input
                                id="fullname"
                                placeholder="Jane Doe"
                                className="text-black"
                                {...form.register("fullname")}
                            />
                            <FieldDescription>Enter First Name and Last Name.</FieldDescription>
                            <FieldError>{form.formState.errors.fullname?.message}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                placeholder="janedoe@example.com"

                                {...form.register("email")}
                            />
                            <FieldDescription>Enter your email.</FieldDescription>
                            <FieldError>{form.formState.errors.email?.message}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <PasswordInput
                                id="password"
                                placeholder="Enter your password"
                                {...form.register("password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <FieldDescription>Enter your password.</FieldDescription>
                            <FieldError>{form.formState.errors.password?.message}</FieldError>
                        </Field>
                        <Button type="submit" className="w-full cursor-pointer">{isLoading ? (<img src="/loader.gif" width={30} />) : (<p>Sign up</p>)}</Button>

                        <small className="text-black block text-center">Already have an account?
                            {" "}<Link to="/auth/login" className="text-blue-700">sign in</Link>
                        </small>

                    </form>
                </Form>
            </div>

        </div>
    )
}

export default Signup