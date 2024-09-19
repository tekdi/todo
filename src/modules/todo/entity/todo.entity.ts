import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("todo")
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  todo_id: string;

  @Column({ type: "integer", nullable: true })
  asset_id: number;

  @Column({ type: "integer", nullable: true })
  ordering: number;

  @Column({ type: "varchar", nullable: true })
  state: string;

  @Column({ type: "varchar", nullable: true })
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

  @Column({ type: "varchar", length: 100, nullable: true })
  status: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  type: string;

  @Column({ type: "uuid", name: "createdBy", nullable: true })
  createdBy: string;

  @Column({ type: "uuid", name: "updatedBy", nullable: true })
  updatedBy: string;

  @Column({ type: "date", name: "createdAt", nullable: true })
  createdAt: Date;

  @Column({ type: "date", name: "updatedAt", nullable: true })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  ideal_time: Date;

  @Column({ type: "timestamp", nullable: true })
  spent_time: Date;

  @Column({ type: "jsonb", nullable: true })
  action_data: object;
}
