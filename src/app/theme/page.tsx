"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function DarkModePage() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Header */}
      <section className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Appearance
              </h1>
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                Choose between Light or Dark mode
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="border bg-gray-50 border-gray-200 dark:border-gray-700 border-t rounded-xl p-6 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </Label>
                <p className="text-sm text-gray-600 dark:text-neutral-300">
                  Enable dark mode for a more comfortable viewing experience at night.
                </p>
              </div>

              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className={`
                  border-2 border-gray-200  dark:border-white
                  bg-gray-200
                  data-[state=checked]:bg-black dark:data-[state=checked]:bg-white
                  transition-colors duration-200
                  rounded-full
                `}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
