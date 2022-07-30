//! Abstraction around invoking the `git` command-line application.
//!
//! We intentionally don't use a library such as `git2` because that would
//! require linking against `libgit2`, which is a big PITA, particularly if
//! you want fully static binaries as we do here. We don't really need much
//! of git's functionality, so we're better off just invoking the git binary
//! and parsing output.

use crate::prelude::*;

use std::path::PathBuf;
use std::process::Command;

#[derive(Debug)]
pub struct Repo {
    path: PathBuf,
}

impl Repo {
    pub fn new(path: impl Into<PathBuf>) -> Self {
        Repo { path: path.into() }
    }

    fn git(&self) -> Command {
        let mut cmd = Command::new("git");
        cmd.current_dir(&self.path);
        cmd
    }

    /// Retrieves a list of all references in the repository.
    ///
    /// This includes all branches (both remote and local) and all tags.
    pub fn refs(&self) -> Result<Vec<String>> {
        let output = self
            .git()
            .args(&["for-each-ref", "--format", "%(refname)"])
            .output()
            .context("failed to run git")?;

        ensure!(
            output.status.success(),
            "git branch failed: {}",
            conv_output(&output.stderr)?
        );

        output
            .stdout
            .split(|&x| x == b'\n')
            .filter(|x| !x.is_empty())
            .map(|x| Ok(conv_output(x)?.to_owned()))
            .collect()
    }

    /// Checks out the given ref in the repository.
    pub fn checkout(&self, git_ref: &str) -> Result<()> {
        self.git()
            .args(&["checkout", git_ref])
            .output()
            .map(drop)
            .context("failed to checkout reference")
    }
}

fn conv_output(raw: &[u8]) -> Result<&str> {
    str::from_utf8(raw).context("git created non-UTF8 output")
}

#[derive(Debug)]
enum Ref {
    Tag(String),
}
