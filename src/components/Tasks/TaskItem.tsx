import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTasksStore } from "../../stores/useTasksStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fakeApiUpdate } from "@/helper/api";
import type { Priority, Task } from "@/types/types";
import { toast } from "sonner";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  task: Task;
  addOptimistic: (update: { id: string; title: string; priority: string }) => void;
};

export default function TaskItem({ task, addOptimistic }: Props) {
  const [editing, setEditing] = useState(false);
  const { register, control, handleSubmit, setValue, reset } = useForm<{
    title: string;
    priority: string;
  }>({
    defaultValues: { title: task.title },
  });

  const updateTaskOptimistic = useTasksStore(
    (state) => state.updateTaskOptimistic
  );
  const rollbackUpdate = useTasksStore((state) => state.rollbackUpdate);
  const getTaskById = useTasksStore((state) => state.getTaskById);

  const startEdit = () => {
    setEditing(true);
    setValue("title", task.title);
    setValue("priority", task.priority as string);
  };

  const cancelEdit = () => {
    setEditing(false);
    reset({ title: task.title, priority: task.priority });
  };

  const onSubmit = handleSubmit(async (values) => {
    const newTitle = values.title.trim() as string;
    const newPriority = values.priority as Priority;
    if (!newTitle) {
      toast.error("Title cannot be empty");
      return;
    }
    if (newTitle === task.title && newPriority === task.priority) {
      setEditing(false);
      return;
    }

    // Save previous task for rollback
    const prevTask = getTaskById(task.id);
    if (!prevTask) {
      toast.error("Task not found");
      return;
    }

    // taskList will rerender using optimisticTasks
    addOptimistic({ id: task.id, title: newTitle, priority: newPriority });

    
    // it will not update to final store until API success, but we need to keep previous task to rollback.
    try {
      // Fake API
      await fakeApiUpdate({ id: task.id, title: newTitle, priority: newPriority }, 2000);
      // success -> commit to Zustand final state
      updateTaskOptimistic(task.id, { title: newTitle, priority: newPriority });
      toast.success("Saved Successfully");
    } catch (err) {
      console.log("Error: ", err);
      // failure -> rollback store to previous task
      rollbackUpdate(prevTask);
      toast.error("Save failed — reverted");
    } finally {
      setEditing(false);
    }
  });

  return (
    <li className="p-3 border rounded-md bg-white shadow-sm">
      {editing ? (
        <form onSubmit={onSubmit} className="flex gap-2 items-center">
          <div className="grow">
            <Label className="mb-1.5">Priority</Label>
            <Input {...register("title")} autoFocus />
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
          <Button className="cursor-pointer self-end bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:bg-linear-to-br focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 font-medium" type="submit">
            Save
          </Button>
          <Button
            className="cursor-pointer self-end bg-linear-to-r from-red-400 via-red-500 to-red-600 hover:bg-linear-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-white hover:text-white"
            type="button"
            variant="outline"
            onClick={cancelEdit}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div onClick={startEdit} className="flex justify-between items-center">
          <div className="cursor-pointer flex-1" onClick={startEdit}>
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-muted-foreground">{task.priority}</div>
          </div>
        </div>
      )}
    </li>
  );
}
