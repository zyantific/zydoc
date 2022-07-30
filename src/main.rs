pub mod git;
pub(crate) mod prelude;

fn try_main() -> anyhow::Result<()> {
    let repo = git::Repo::new("/home/ath/devel/zydis");

    for git_ref in repo.refs()? {
        println!("Visiting `{}`", git_ref);
        repo.checkout(&git_ref)?;
    }

    repo.checkout("master")?;

    Ok(())
}

fn main() {
    if let Err(e) = try_main() {
        eprintln!("Error: {:?}", e);
    }
}
