// SettingsPage.tsx
"use client";
import * as z from "zod";
import countries from "@/countries.json"; // Adjust the path as per your project structure

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { SettingsSchema } from "@/schemas";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UserInfo } from "@/components/user-info";
import UserPage from "../client/page";

const SettingsPage = () => {
  const user = useCurrentUser();
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      primarySkill: user?.primarySkill || undefined,
      secondarySkills: user?.secondarySkills || " ",
      country: user?.country || undefined,
      location: user?.location || undefined,
      post: user?.post || undefined,
      projects: user?.projects || undefined,
      friends: user?.friends || [],
      institution: user?.institution || undefined,
      study: user?.study || undefined,
      profilePic: user?.profilePic || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      // Convert secondarySkills to array if it's a string
      const updatedValues = {
        ...values,
        secondarySkills:
          typeof values.secondarySkills === "string"
            ? values.secondarySkills.split(",")
            : values.secondarySkills,
      };

      settings(updatedValues)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setSuccess(undefined);
          } else if (data.success) {
            setSuccess(data.success);
            setError(undefined);
            update();
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-700">
      <div className=" w-full min-h-full p-6 bg-blue-950 rounded-lg ">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-bold">Setting</h1>
          
        </header>
        <Card className="border mt-6 bg-gray-800 shadow-lg rounded-lg ">
          
          <div className="ml-6 mr-6 flex space-x-6">
            <nav className="flex mt-7 flex-col w-1/4 space-y-4">
            <div className="relative w-full">
            <UserPage/>
          </div>
              <button className="p-2 text-left text-white bg-blue-500 rounded-lg">
                Edit Profile
              </button>
              <button className="p-2 text-left text-white rounded-lg">
                Notifications
              </button>
              <button className="p-2 text-left text-white rounded-lg">
                Password Management
              </button>
            </nav>

            <div className="w-3/4 p-6 bg-gray-700 rounded-lg">
              <h2 className="mb-4 text-white text-lg font-bold">
                Edit Profile
              </h2>
              <CardContent>
                <Form {...form}>
                  <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="John Doe"
                                  disabled={isPending}
                                  className="input-field"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                        {!user?.isOAuth && (
                          <>
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Email
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="email"
                                      placeholder="john.doe@example.com"
                                      disabled={isPending}
                                      className="input-field"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="******"
                                      disabled={isPending}
                                      className="input-field"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    New Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="******"
                                      disabled={isPending}
                                      className="input-field"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        <FormField
                          control={form.control}
                          name="primarySkill"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Primary Skill
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Primary Skill"
                                  disabled={isPending}
                                  className="input-field"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="secondarySkills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Secondary Skills (comma-separated)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Secondary Skills"
                                  disabled={isPending}
                                  className="input-field"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel className="block font-medium text-white mb-2">
                                Country
                              </FormLabel>
                              <FormControl>
                                <Select {...field} disabled={isPending}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Countries</SelectLabel>
                                      {countries.map((country, index) => (
                                        <SelectItem
                                          key={index}
                                          value={country.code}
                                        >
                                          {country.name}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="mt-2 text-sm text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Timezone</FormLabel>
                              <FormControl>
                                <Select {...field}>
                                  <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select a timezone" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>North America</SelectLabel>
                                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                      <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                      <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                      <SelectLabel>Europe & Africa</SelectLabel>
                                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                      <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                                      <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
                                      <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                                      <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                      <SelectLabel>Asia</SelectLabel>
                                      <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                                      <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                      <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                                      <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                      <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                                      <SelectItem value="ist_indonesia">Indonesia Central Standard Time (WITA)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                      <SelectLabel>Australia & Pacific</SelectLabel>
                                      <SelectItem value="awst">Australian Western Standard Time (AWST)</SelectItem>
                                      <SelectItem value="acst">Australian Central Standard Time (ACST)</SelectItem>
                                      <SelectItem value="aest">Australian Eastern Standard Time (AEST)</SelectItem>
                                      <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                                      <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                      <SelectLabel>South America</SelectLabel>
                                      <SelectItem value="art">Argentina Time (ART)</SelectItem>
                                      <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                                      <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                                      <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Institution
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Institution"
                                  disabled={isPending}
                                  className="input-field"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="study"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Field of Study
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Field of Study"
                                  disabled={isPending}
                                  className="input-field"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                          <FormField
                          control={form.control}
                          name="about"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                About
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Tell about yourself"
                                  disabled={isPending}
                                  className="input-field"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      
                      </div>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <div className="flex justify-end">
                      <Button
                        disabled={isPending}
                        type="submit"
                        className="button"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
