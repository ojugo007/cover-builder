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
import { CircleCheck, CircleX, ChevronLeft, ChevronRight } from "lucide-react"


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
    const [currentStep, setCurrentStep] = useState(1)
    const [userData, setUserData] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const totalSteps = 3

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

            if (response.data.token) {
               localStorage.setItem('token', response.data.token)
            }

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
            window.location.href = "/upload"

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
    
    // Common input class for consistent styling on white background
    const inputClassName = "bg-white text-black border-2 border-slate-300 focus:bg-white focus:border-slate-800 focus-visible:ring-2 focus-visible:ring-slate-700/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background [-webkit-appearance:none]"

    // Validate current step before moving forward
    const validateStep = async () => {
        let fieldsToValidate: Array<keyof z.infer<typeof formSchema>> = []
        
        switch(currentStep) {
            case 1:
                fieldsToValidate = ['phone', 'address']
                break
            case 2:
                fieldsToValidate = ['linkedin_url', 'personal_url']
                break
            case 3:
                fieldsToValidate = ['skills', 'bio']
                break
        }

        const isValid = await form.trigger(fieldsToValidate)
        return isValid
    }

    const handleNext = async () => {
        const isValid = await validateStep()
        if (isValid && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmitStep = async () => {
        const isValid = await validateStep()
        if (isValid) {
            form.handleSubmit(onSubmit)()
        }
    }

    return (
        <>
            <div className='max-w-full px-4 md:px-0 md:max-w-[60%] mx-auto py-5'>
                <h2 className='text-2xl pb-8'>Profile</h2>
                
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep >= step 
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-white text-slate-400 border-slate-300'
                                }`}>
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div className={`flex-1 h-1 mx-2 ${
                                        currentStep > step ? 'bg-black' : 'bg-slate-300'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 mt-2">
                        <span>Contact Info</span>
                        <span>Professional Links</span>
                        <span>Work Info</span>
                    </div>
                </div>

                <section>
                    <Card className='bg-white border border-slate-700 text-black mb-5'>
                        <CardHeader>
                            <CardTitle><h2>Personal info</h2></CardTitle>
                        </CardHeader>
                        <CardContent className='flex items-center justify-between'>
                            <div>
                                <h4 className='text-[16px]'>Full Name</h4>
                                <span className='capitalize'>{user?.fullname}</span>
                            </div>
                            <div>
                                <h4 className='text-[16px]'>Email</h4>
                                <span>{user?.email}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Form {...form}>
                        <form onSubmit={(e) => { e.preventDefault() }} className='flex flex-col space-y-5'>
                            
                            {/* Step 1: Contact Info */}
                            {currentStep === 1 && (
                                <Card className='bg-white border border-slate-700 text-black'>
                                    <CardHeader>
                                        <CardTitle><h2>Contact info</h2></CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Field>
                                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                            <Input
                                                id="phone"
                                                placeholder="+234 xxx-xxx-xxxx"
                                                className={`mb-5 ${inputClassName}`}
                                                style={{ backgroundColor: '#fff', color: '#000' }}
                                                {...form.register("phone")}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="address">Address</FieldLabel>
                                            <Input
                                                id="address"
                                                placeholder="City, Country"
                                                className={inputClassName}
                                                style={{ backgroundColor: '#fff', color: '#000' }}
                                                {...form.register("address")}
                                            />
                                            <FieldError>{form.formState.errors.address?.message}</FieldError>
                                        </Field>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 2: Professional Links */}
                            {currentStep === 2 && (
                                <Card className='bg-white border border-slate-700 text-black'>
                                    <CardHeader>
                                        <CardTitle><h2>Professional Links</h2></CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <Field>
                                            <FieldLabel htmlFor="linkedin_url">Linkedin url</FieldLabel>
                                            <Input
                                                id="linkedin_url"
                                                placeholder="Enter Linkedin url"
                                                className={inputClassName}
                                                style={{ backgroundColor: '#fff', color: '#000' }}
                                                {...form.register("linkedin_url")}
                                            />
                                            <FieldError>{form.formState.errors.linkedin_url?.message}</FieldError>
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="personal_url">Professional Link</FieldLabel>
                                            <Input
                                                id="personal_url"
                                                placeholder="Portfolio url, Personal website or Github profile"
                                                className={inputClassName}
                                                style={{ backgroundColor: '#fff', color: '#000' }}
                                                {...form.register("personal_url")}
                                            />
                                            <FieldDescription>Relevant professional link showcasing your work</FieldDescription>
                                            <FieldError>{form.formState.errors.personal_url?.message}</FieldError>
                                        </Field>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 3: Work Info */}
                            {currentStep === 3 && (
                                <Card className='bg-white border border-slate-700 text-black'>
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
                                                className={inputClassName}
                                                style={{ backgroundColor: '#fff', color: '#000' }}
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
                                                        className={inputClassName}
                                                        enterKeyHint="done"
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
                                                className={inputClassName}
                                                style={{ backgroundColor: '#fff', color: '#000' }}
                                                {...form.register("work_exp")}
                                            />
                                            <FieldError>{form.formState.errors.work_exp?.message}</FieldError>
                                        </Field>
                                        
                                        <Field>
                                            <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                            <Textarea
                                                id="bio"
                                                placeholder="write briefly about your professional identity and core skills"
                                                className={inputClassName}
                                                style={{ backgroundColor: '#fff', color: '#000' }}
                                                {...form.register("bio")}
                                            />
                                            <FieldError>{form.formState.errors.bio?.message}</FieldError>
                                        </Field>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between gap-4">
                                <Button
                                    type="button"
                                    variant='outline'
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className={`cursor-pointer border-2 transition-colors [-webkit-appearance:none] ${
                                        currentStep === 1 
                                            ? 'border-slate-300 bg-slate-100 text-slate-400' 
                                            : 'border-black bg-white text-black hover:bg-black hover:text-white'
                                    }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>

                                {currentStep < totalSteps ? (
                                    <Button
                                        type="button"
                                        variant='outline'
                                        onClick={handleNext}
                                        className='cursor-pointer border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors [-webkit-appearance:none]'
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant='outline'
                                        onClick={handleSubmitStep}
                                        className='cursor-pointer border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors [-webkit-appearance:none]'
                                        style={{ backgroundColor: '#000', color: '#fff' }}
                                    >
                                        {isLoading ? (<img src="/loader.gif" width={30} alt="loading" />) : (<p>Update Profile</p>)}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </section>
            </div>
        </>
    )
}

export default Profile