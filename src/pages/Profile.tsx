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
// import { useState } from "react"



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
// https://cover-letter-builder.onrender.com/user/update-profile
const Profile = () => {
    // const [skills, setSkills] = useState<string[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "skills": [""]
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const data = {...values, years_of_exp:Number(values.years_of_exp)}
            console.log(data);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <>
            <div className='max-w-[60%] mx-auto py-5'>
                <h2 className='text-2xl pb-8'>Profile</h2>
                <section>
                    <Card className='bg-black border border-slate-700 text-white'>
                        <CardHeader>
                            <CardTitle><h2>Personal info</h2></CardTitle>
                        </CardHeader>
                        <CardContent className='flex items-center justify-between '>
                            <div>
                                <h4 className='text-[16px]'>Full Name</h4>
                                <span className='capitalize'>john doe </span>
                            </div>
                            <div>
                                <h4 className='text-[16px]'>Email</h4>
                                <span>johndoe@example.com </span>
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
                            <Button variant='outline' className='cursor-pointer border-2 border-white bg-black' type="submit">Update Profile</Button>
                        </form>
                    </Form>

                </section>
            </div>
        </>
    )
}

export default Profile