"use client";

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
import Image from "next/image";
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

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="p-5 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold pb-1">Login Admin</h1>
              <p className="pb-4 text-balance text-muted-foreground text-sm opacity-75">
                Enter admin email below to login dashboard admin
              </p>
            </div>
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            {...field}
                            type="email"
                            placeholder="john@mail.com"
                            required
                          />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            {...field}
                            type="password"
                            placeholder="enter your password"
                            required
                          />
                        </FormControl>
                        <FormDescription>
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
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://images.pexels.com/photos/4916192/pexels-photo-4916192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginList;
