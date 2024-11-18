"use client";

import ImageSlider from "@/components/ImageSlider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePersistedAdmin } from "@/zustand/admins";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const LoginList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [setToken, setRole, setLogged, is_logged] = usePersistedAdmin(
    (state) => [state.setToken, state.setRole, state.setLogged, state.is_logged]
  );

  useEffect(() => {
    if (is_logged === true) {
      router.push("/Dashboard");
    }
  }, [router, is_logged]);

  const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseJson = await response.json();
      // console.log(responseJson)

      if (responseJson.success === true) {
        setIsLoading(false);
        toast.success(responseJson.message);
        setToken(responseJson.data.token);
        setRole(responseJson.data.payload.role_id);
        setLogged(true);
        router.push("/Dashboard");
        return;
      }

      setIsLoading(false);
      toast.error(responseJson.message);
    } catch (error: any) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  const carouselUrl = ["/images/belega-1.jpeg", "/images/belega-2.jpg", "/images/belega-3.jpeg", "/images/belega-4.jpg"];

  return (
    <div className="w-full lg:grid lg:max-h-screen lg:grid-cols-2 max-h-screen overflow-x-hidden overflow-y-hidden">
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto grid w-[400px] gap-6 bg-white shadow-lg rounded-lg">
          <div className="p-6 bg-white shadow-md ring-1 ring-gray-900/5 rounded-lg">
            <div className="grid gap-3 text-center">
              <h1 className="text-4xl font-extrabold text-gray-800 pb-2">Admin Login</h1>
              <p className="pb-5 text-lg text-gray-600">
                Enter your admin credentials to access the dashboard
              </p>
            </div>
            <div className="grid gap-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-7"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email" className="text-lg font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            {...field}
                            type="email"
                            placeholder="john@mail.com"
                            className="border-2 border-gray-300 rounded-md p-2"
                            required
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-500">
                          We`ll never share your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password" className="text-lg font-medium">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            className="border-2 border-gray-300 rounded-md p-2"
                            required
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-500">
                          Password must be at least 5 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="lime" className="w-full">
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block h-screen relative">
        <ImageSlider urls={carouselUrl} />
      </div>
    </div>
  );
};

export default LoginList;
