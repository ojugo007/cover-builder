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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import axios from 'axios';

const formSchema = z.object({
    email: z.string(),
    password: z.string()
});


const Login = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    const [remember, setRemember] = useState(false)


    const credentialRequested = useRef(false);

    useEffect(() => {
        if (
            credentialRequested.current ||
            !("credentials" in navigator)
        ) {
            return;
        }

        credentialRequested.current = true;

        navigator.credentials
            .get({
                password: true,
                mediation: "optional",
            } as PasswordCredentialRequestOptions)
            .then((cred) => {
                if (cred && cred instanceof PasswordCredential) {
                    form.setValue("email", cred.id);
                    form.setValue("password", cred.password || "");
                }
            })
            .catch(console.error);
    }, [form]);


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            const url = 'https://cover-letter-builder.onrender.com/auth/login'
            const response = await axios.post(url, values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(response.data)
            localStorage.setItem("token", response.data.token)
            toast.success(response.data.message);

            if (remember && 'credentials' in navigator) {
                const cred = new PasswordCredential({
                    id: values.email,
                    password: values.password,
                    name: values.email,
                });
                navigator.credentials.store(cred);

            }

        } catch (error: any) {
            console.error("Form submission error", error);
            toast.error(error.response.data.message);
        }
    }


    return (
        <div className='max-w-full min-h-screen relative bg-[url(/grid.png)] bg-cover bg-center bg-no-repeat flex items-center justify-center'>
            {/* overlay */}
            <div className='absolute inset-0 bg-black/60 w-full'></div>
            <div className='relative z-10 w-full h-full bg-white max-w-[400px] mx-auto p-7 rounded'>
                <h3 className="text-black text-2xl text-center">Log In</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
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
                            <Input
                                id="password"
                                placeholder="Enter your password"
                                {...form.register("password")}
                            />
                            <FieldDescription>Enter your password.</FieldDescription>
                            <FieldError>{form.formState.errors.password?.message}</FieldError>
                        </Field>
                        <Button type="submit" className="w-full cursor-pointer">Login</Button>

                        <div className="flex items-center gap-3">
                            <Checkbox id="remember_password" checked={remember} onCheckedChange={(value) => setRemember(!!value)} />
                            <Label htmlFor="remember_password" className="text-[#333]">Remember your password</Label>
                        </div>

                        <small className="text-black">Don't have an account?
                            {" "}<Link to="/auth/signup" className="text-blue-700">create account</Link>
                        </small>

                    </form>
                </Form>
            </div>

        </div>
    )
}

export default Login