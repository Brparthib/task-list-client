import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTasksStore } from "@/stores/useTasksStore";
import type { Task } from "@/types/types";
import { toast } from "sonner";

type FormValues = { title: string; priority: string };

export default function AddTask() {
  const addTask = useTasksStore((state) => state.addTask);
  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { title: "", priority: "low" },
  });

  const onSubmit = (values: FormValues) => {
    const task: Task = {
      id: uuidv4(),
      title: values.title.trim(),
      priority: values.priority as Task["priority"],
    };
    if (!task.title) return;
    addTask(task);
    reset();
    toast.success("Task Added Successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4">
        <div className="grow">
          <Label className="mb-1.5">Title</Label>
          <Input
            {...register("title", { required: true })}
            placeholder="Write a task..."
          />
        </div>

        <div>
          <Label className="mb-1.5">Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                defaultValue="low"
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="self-end">
          <Button
            className="cursor-pointer bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-linear-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg"
            type="submit"
          >
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
}
