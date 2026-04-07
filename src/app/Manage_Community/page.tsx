"use client";

import React, { useEffect, useState } from "react";
import { getCommunities } from "@/app/Manage_Community/getAllCommunities";
import Link from "next/link";
import { deleteCommunityAction } from "./deleteAction";

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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

function CommunityTableToolbar({
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
          Community List
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

export default function ManageCommunityPage() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getCommunities().then(setCommunities);
  }, []);

  const isSelected = (id: string) => selected.includes(id);

  const handleClick = (id: string) => {
    setSelected((prev) =>
      isSelected(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = filteredCommunities.map((c) => c.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    const selectedCommunities = communities.filter((c) => selected.includes(c.id));
    const selectedTitles = selectedCommunities.map((c) => `• ${c.title}`).join("\n");

    const confirmed = window.confirm(
      `Are you sure you want to delete the following community(ies)?\n\n${selectedTitles}`
    );
    if (!confirmed) return;

    await Promise.all(
      selectedCommunities.map(async (community) => {
        const formData = new FormData();
        formData.append("communityId", community.id);
        await deleteCommunityAction(formData);
      })
    );

    // Optimistic UI update
    const remaining = communities.filter((c) => !selected.includes(c.id));
    setCommunities(remaining);
    setSelected([]);
  };

  const filteredCommunities = communities.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Banner */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manage Communities</h1>
              <p className="text-sm text-gray-600">View and manage all APHive communities</p>
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
            <CommunityTableToolbar numSelected={selected.length} onDelete={handleDelete} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selected.length > 0 && selected.length < filteredCommunities.length
                        }
                        checked={
                          filteredCommunities.length > 0 &&
                          selected.length === filteredCommunities.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>Community Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCommunities.map((community) => {
                    const isItemSelected = isSelected(community.id);
                    return (
                      <TableRow
                        key={community.id}
                        hover
                        role="checkbox"
                        selected={isItemSelected}
                        onClick={() => handleClick(community.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/community/${community.slug}`} passHref>
                            <span className="hover:underline cursor-pointer">
                              {community.title}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>{community.description}</TableCell>
                        <TableCell>
                          {community.createdAt
                            ? new Date(community.createdAt).toLocaleDateString()
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
