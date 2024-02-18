import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {SignUpValidation} from "../../lib/validation/index"
import { z } from 'zod'
import Loader from '@/components/shared/Loader'
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { signInAccount } from '@/lib/appwrite/api'
import { useUserContext } from '@/context/AuthContext'




const SignUpForm = () => {
  const { mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSignIn} = useSignInAccount();
  const { toast } = useToast();
  const navigate = useNavigate();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values);

    if(!newUser){
      return  toast({ title: "Sign Up failed. Please try again."});
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if(!session){
      return toast({title: "Sign in failed. Please try again."})
    }
    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn){
      form.reset();

      navigate('/');
    }else {
      toast({title: "Sign up failed. Please try again"});
    }
  }


  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-2 sm:pt-12">Create new account</h2>
        <p className="small-medium text-light-3 md:base-regular mt-2">To use Social Network enter your details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ): "Sign Up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
             Already have an account? 
             <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-2">Log In</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm