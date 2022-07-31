pub(crate) mod git;
pub(crate) mod prelude;
pub(crate) mod run;

fn main() -> std::process::ExitCode {
    if let Err(e) = run::run() {
        eprintln!("Error: {:?}", e);
        return 1.into();
    }

    0.into()
}
