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
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import {
  Button
} from "@/components/ui/button"
import {useState } from "react"
import { Input } from "@/components/ui/input"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
 import { CloudUpload , Sparkles} from 'lucide-react';
import CoverLetterEditor from "@/components/CoverLetterEditor"
import axios from "axios"


const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type.startsWith("image/"),
      "Only image files are allowed"
    ),
});

const Generator = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading]= useState(false)

  const [coverLetter, setCoverLetter] = useState("")
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // to check if a file is selected
  const { watch } = form;
  const selectedFile = watch("file");

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("file", values.file);
    const token = localStorage.getItem('token')

    console.log(values.file);
    try{
      setIsLoading(true)
      const response = await axios.post("https://cover-letter-builder.onrender.com/upload", formData, {
        headers : {
          "Authorization": `bearer ${token}`
        }
      })
      // console.log(response.data.coverLetter)

      setCoverLetter(response.data.coverLetter)
    }catch(error){
      console.log(error)
    }finally{
      setIsLoading(false)
    }
 
  };

  return (
    <div className="w-full px-4  sm:px-6 lg:px-8 py-6 md:py-8">
    <div className="flex flex-col md:flex-row gap-5 items-start p-0 sm:p-8 w-full">
      <aside className="w-full md:w-1/2 lg:w-5/12">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <Controller
              name="file"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Upload Job Description Image</FieldLabel>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);

                      const droppedFile = e.dataTransfer.files?.[0];
                      if (droppedFile) field.onChange(droppedFile);
                    }}
                    onClick={() =>
                      document.getElementById("image-input")?.click()
                    }
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer transition ",
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/40"
                    )}
                  >
                    <div className="bg-slate-700 p-2 rounded-full hover:bg-slate-800">
                    <CloudUpload size={35} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop an image here, or click to select
                    </p>

                    {field.value && (
                      <p className="mt-2 text-sm font-medium truncate max-w-full">
                        {field.value.name}
                      </p>
                    )}
                  </div>

                  <Input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                  />

                  <FieldError>
                    {form.formState.errors.file?.message}
                  </FieldError>
                </Field>
              )}
            />
            {selectedFile && (<Button type="submit" variant='outline' className='cursor-pointer border-2 border-white bg-black w-[200px]'>{isLoading?(<img src="/loader.gif" width={30}/>):(<>Generate Cover-letter <Sparkles/></>  )}</Button>)}
          </form>
        </Form>
      </aside>
      <main className="w-full md:flex-1 border rounded-xl border-muted-foreground/40 min-w-0 " >
        <CoverLetterEditor coverLetter ={coverLetter}/>
      </main>

    </div>
    </div>
  )
}

export default Generator