import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

  @Column({ type: "uuid" })
  assigned_by: string;

  @Column({ type: "uuid" })
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

  @Column({ type: "uuid", name: "created_by" })
  created_by: string;

  @Column({ type: "uuid", name: "updated_by" })
  updated_by: string;

  @CreateDateColumn({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: "time", nullable: true })
  ideal_time: string;

  @Column({ type: "time", nullable: true })
  spent_time: string;

  @Column({ type: "date", name: "completion_date" })
  completion_date: Date

  @Column({ type: "jsonb", nullable: true })
  action_data: object;
}
