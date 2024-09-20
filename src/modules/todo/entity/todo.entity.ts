import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("todo")
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  todo_id: string;

  @Column({ type: "integer", nullable: true })
  asset_id: number;

  @Column({ type: "integer" })
  ordering: number;

  @Column({ type: "varchar" })
  state: string;

  @Column({ type: "varchar" })
  sender_msg: string;

  @Column({ type: "uuid", nullable: true })
  context_id: string;

  @Column({ type: "varchar", nullable: true })
  context: string;

  @Column({ type: "uuid", nullable: true })
  assigned_by: string;

  @Column({ type: "uuid", nullable: true })
  assigned_to: string;

  @Column({ type: "date", nullable: true })
  start_date: Date;

  @Column({ type: "date", nullable: true })
  due_date: Date;

  @Column({ type: "varchar" })
  status: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  type: string;

  @Column({ type: "uuid", name: "createdBy" })
  createdBy: string;

  @Column({ type: "uuid", name: "updatedBy" })
  updatedBy: string;

  @Column({ type: "date", name: "createdAt" })
  createdAt: Date;

  @Column({ type: "date", name: "updatedAt" })
  updatedAt: Date;

  @Column({ type: "time", nullable: true })
  ideal_time: string;

  @Column({ type: "time", nullable: true })
  spent_time: string;

  @Column({ type: "jsonb", nullable: true })
  action_data: object;
}
