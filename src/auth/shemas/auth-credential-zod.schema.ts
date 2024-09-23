import { TaskSchema } from 'src/tasks/schemas/task-zod.schema';
import { z } from 'zod';

export const AuthCredentialSchema = z.object({
  id: z.string().uuid(),
  mail: z.string().email(),
  password: z.string().min(1, { message: 'enter smth' }),
  role: z.enum(['admin', 'user']),
  task: z.array(TaskSchema).optional(),
});
