pub(crate) mod git;
pub(crate) mod prelude;
pub(crate) mod run;

fn main() {
    if let Err(e) = run::run() {
        eprintln!("Error: {:?}", e);
    }
}
