import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity({ name: "Bookmarks" })
@Index(["userId", "doId"], { unique: true })
export class Bookmark {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "userId", type: "uuid", nullable: false })
  userId: string;

  @Column({ name: "entityType", type: "varchar", length: 100, nullable: false })
  entityType: string;

  @Column({ name: "doId", type: "varchar", length: 100, nullable: false })
  doId: string;

  @CreateDateColumn({
    name: "createdAt",
    type: "timestamp with time zone",
    default: () => "now()",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updatedAt",
    type: "timestamp with time zone",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column({ name: "createdBy", type: "varchar", nullable: true })
  createdBy: string;

  @Column({ name: "updatedBy", type: "varchar", nullable: true })
  updatedBy: string;
} 