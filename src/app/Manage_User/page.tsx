"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/app/Manage_User/getAllUser";
import { deleteUserAction } from "@/app/Manage_User/deleteAction";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  InputBase,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

function UserTableToolbar({
  numSelected,
  onDelete,
}: {
  numSelected: number;
  onDelete: () => void;
}) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: "rgba(0, 0, 0, 0.04)",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6">
          User List
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function ManageUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const isSelected = (id: string) => selected.includes(id);

  const handleClick = (id: string) => {
    setSelected((prev) =>
      isSelected(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = filteredUsers.map((u) => u.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    const selectedUsers = users.filter((u) => selected.includes(u.id));
    const selectedNames = selectedUsers.map((u) => `• ${u.username}`).join("\n");

    const confirmed = window.confirm(
      `Are you sure you want to delete the following user(s)?\n\n${selectedNames}`
    );
    if (!confirmed) return;

    await Promise.all(
      selectedUsers.map(async (user) => {
        const formData = new FormData();
        formData.append("userId", user.id);
        await deleteUserAction(formData);
      })
    );

    const remaining = users.filter((u) => !selected.includes(u.id));
    setUsers(remaining);
    setSelected([]);
  };

    const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
        u.username.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
    });


  return (
    <>
      {/* Header */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <p className="text-sm text-gray-600">View and manage all APHive users</p>
            </div>
            <div className="flex items-center border rounded px-2 py-1 bg-gray-100">
              <SearchIcon className="text-gray-500 mr-1" />
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Paper elevation={1}>
            <UserTableToolbar numSelected={selected.length} onDelete={handleDelete} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selected.length > 0 && selected.length < filteredUsers.length
                        }
                        checked={
                          filteredUsers.length > 0 &&
                          selected.length === filteredUsers.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const isItemSelected = isSelected(user.id);
                    return (
                      <TableRow
                        key={user.id}
                        hover
                        selected={isItemSelected}
                        onClick={() => handleClick(user.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell>
                          <Avatar src={user.imageUrl} alt={user.username} />
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/user/${user.id}`} passHref>
                            <span className="hover:underline cursor-pointer">{user.username}</span>
                          </Link>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.status}</TableCell>
                        <TableCell>
                          {user.joinedAt
                            ? new Date(user.joinedAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </section>
    </>
  );
}
