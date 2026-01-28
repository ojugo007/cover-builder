import {
    Controller,
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
    FieldError,
    FieldDescription
} from "@/components/ui/field"
import {
    Button
} from "@/components/ui/button"
import {
    Input
} from "@/components/ui/input"
import {
    Textarea
} from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { TagsInput } from "@/components/ui/tags-input"
import { useAuth } from "@/context/AuthContext";
import axios from "axios"
import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import { CircleCheck, CircleX } from "lucide-react"


const formSchema = z.object({
    phone: z.string(),
    address: z.string().min(1),
    linkedin_url: z.string().min(1),
    personal_url: z.string().min(1),
    skills: z.array(z.string()).min(1, {
        error: "Please select at least one item"
    }),
    years_of_exp: z.string().optional(),
    work_exp: z.string().optional(),
    bio: z.string()
});

// clean up empty fields 
const removeEmptyFields = <T extends Record<string, any>>(obj: T) => {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([_, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
        )
    );
};


interface UserProfile {
    phone: string,
    address: string,
    linkedin_url: string,
    personal_url: string,
    skills: string[],
    years_of_exp: number,
    work_exp: string,
    bio: string,
    profileCompleted: boolean
}

const Profile = () => {

    const [userData, setUserData] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
            linkedin_url: "",
            personal_url: "",
            years_of_exp: "",
            work_exp: "",
            bio: "",
            phone: "",
            skills: []
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const cleanedData = removeEmptyFields({
                ...values,
                years_of_exp: values.years_of_exp
                    ? Number(values.years_of_exp)
                    : undefined,
            });

            const token: string = localStorage.getItem('token')!

            const response = await axios.patch('https://cover-letter-builder.onrender.com/user/update-profile', cleanedData, {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `bearer ${token}`
                }
            })
            
            if (response.status === 200) {
               
             toast(
                <div className="flex items-center gap-2">
                    <CircleCheck size={18} className="text-black bg-green-300 rounded-full" />
                    <span>Profile Successfully Updated</span>
                </div>
                , {
                    unstyled: true,
                    className: 'bg-green-200 text-black p-2 rounded',
                    duration: 5000,
                }
            )
                
                navigate("/upload")
            }

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
        }finally{
            setIsLoading(false)
        }
    }

    async function getUser() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get('https://cover-letter-builder.onrender.com/user/me', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${token}`
                }
            })
            setUserData(res.data)
        } catch (error: any) {
            console.log(error)
        }
    }
    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        if (userData) {
            form.reset({
                address: userData.address ?? "",
                linkedin_url: userData.linkedin_url ?? "",
                personal_url: userData.personal_url ?? "",
                years_of_exp: String(userData.years_of_exp) ?? "",
                work_exp: userData.work_exp ?? "",
                bio: userData.bio ?? "",
                phone: userData.phone ?? "",
                skills: userData.skills ?? [],
            });
        }
    }, [userData, form]);

    const { user } = useAuth()
    return (
        <>
            <div className=' max-w-full px-4 md:px-0 md:max-w-[60%] mx-auto py-5'>
                <h2 className='text-2xl pb-8'>Profile</h2>
                <section>
                    <Card className='bg-white border border-slate-700 text-black'>
                        <CardHeader>
                            <CardTitle><h2>Personal info</h2></CardTitle>
                        </CardHeader>
                        <CardContent className='flex items-center justify-between '>
                            <div>
                                <h4 className='text-[16px]'>Full Name</h4>
                                <span className='capitalize'>{user?.fullname}</span>
                            </div>
                            <div>
                                <h4 className='text-[16px]'>Email</h4>
                                <span>{user?.email} </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Form  {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-5 mt-[50px]'>
                            <Card className='bg-black border border-slate-700 text-white'>
                                <CardHeader>
                                    <CardTitle><h2>Contact info</h2></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Field>
                                        <FieldLabel htmlFor="phone">phone</FieldLabel>
                                        <Input
                                            id="phone"
                                            placeholder="+234 xxx-xxx-xxxx"
                                            className="mb-5"
                                            {...form.register("phone")}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="address">Address</FieldLabel>
                                        <Input
                                            id="address"
                                            placeholder="City, Country"

                                            {...form.register("address")}
                                        />

                                        <FieldError>{form.formState.errors.address?.message}</FieldError>
                                    </Field>

                                    <div className="grid grid-cols-12 gap-4 mt-5">

                                        <div className="col-span-6">
                                            <Field>
                                                <FieldLabel htmlFor="linkedin_url">Linkedin url</FieldLabel>
                                                <Input
                                                    id="linkedin_url"
                                                    placeholder="Enter Linkedin url"

                                                    {...form.register("linkedin_url")}
                                                />

                                                <FieldError>{form.formState.errors.linkedin_url?.message}</FieldError>
                                            </Field>
                                        </div>

                                        <div className="col-span-6">
                                            <Field>
                                                <FieldLabel htmlFor="personal_url">Professional Link</FieldLabel>
                                                <Input
                                                    id="personal_url"
                                                    placeholder="Portfolio url, Personal website or Github profile  behance profile, Google drive link , "

                                                    {...form.register("personal_url")}
                                                />
                                                <FieldDescription>Relevant professional link showcasing your work</FieldDescription>
                                                <FieldError>{form.formState.errors.personal_url?.message}</FieldError>
                                            </Field>
                                        </div>

                                    </div>

                                </CardContent>

                            </Card>

                            <Card className='bg-black border border-slate-700 text-white'>
                                <CardHeader>
                                    <CardTitle><h2>Work info</h2></CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <Field>
                                        <FieldLabel htmlFor="years_of_exp">Years of Experience</FieldLabel>
                                        <Input
                                            id="years_of_exp"
                                            placeholder="how many years of experience"
                                            type='number'
                                            className=""
                                            {...form.register("years_of_exp")}
                                        />

                                        <FieldError>{form.formState.errors.years_of_exp?.message}</FieldError>
                                    </Field>
                                    <Controller
                                        name="skills"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Skills</FieldLabel>

                                                <TagsInput
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Add skills…"
                                                    maxItems={10}
                                                    className="bg-black"
                                                />

                                                <FieldError>
                                                    {form.formState.errors.skills?.message}
                                                </FieldError>
                                            </Field>
                                        )}
                                    />

                                    <Field>
                                        <FieldLabel htmlFor="work_exp">Professional Experience</FieldLabel>
                                        <Textarea
                                            id="work_exp"
                                            placeholder="write briefly about your work experience"

                                            {...form.register("work_exp")}
                                        />

                                        <FieldError>{form.formState.errors.work_exp?.message}</FieldError>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                        <Textarea
                                            id="bio"
                                            placeholder="write briefly about your professional identity and core skills"

                                            {...form.register("bio")}
                                        />

                                        <FieldError>{form.formState.errors.bio?.message}</FieldError>
                                    </Field>

                                </CardContent>

                            </Card>
                            <Button variant='outline' className='cursor-pointer border-2 border-white bg-black' type="submit">{isLoading? (<img src="/loader.gif" width={30} />):(<p>Update Profile</p>)}</Button>
                        </form>
                    </Form>

                </section>
            </div>
        </>
    )
}

export default Profile