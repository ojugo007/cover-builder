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
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"


const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type.startsWith("image/"),
      "Only image files are allowed"
    ),
});

const Generator = () => {
  // https://cover-letter-builder.onrender.com/upload

  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("file", values.file);

    console.log(values.file);

    // axios.post("/upload", formData)
  };


  return (
    <div>
      <aside>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-xl mx-auto py-10 space-y-6"
          >
            <Controller
              name="file"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Upload screenshot</FieldLabel>

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
                      "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer transition",
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/40"
                    )}
                  >
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

            <Button type="submit">Upload Screenshot</Button>
          </form>
        </Form>

      </aside>
      <main>

      </main>

    </div>
  )
}

export default Generator