const pathToJSON = "versions.json";
const currentVersion = window.location.pathname.split("/")[1];
// const currentVersion = "1.0.0";

function generateElement(element, className, innerHTML) {
  let elementToGenerate = document.createElement(element);
  elementToGenerate.classList.add(className);
  if (innerHTML) {
    elementToGenerate.innerHTML = innerHTML;
  }
  return elementToGenerate;
}

const data = fetch(pathToJSON)
  .then((response) => response.json())
  .then((data) => {
    let tags = data.tags;
    let vmWrapper = generateElement("div", "vm-wrapper");
    let vmVersions = generateElement("ul", "vm-versions");
    vmVersions.id = "vm-versions";
    let vmCurrent = generateElement("li", "vm-current");
    tags
      .slice()
      .reverse()
      .forEach((tag) => {
        let vmOther = generateElement("li", "vm-other");
        vmOther.id = "vm-other";
        let vmOtherToggle = generateElement(
          "span",
          "vm-other-toggle",
          tag.major
        );
        vmOther.appendChild(vmOtherToggle);
        let vmSubversions = generateElement("ul", "vm-subversions");
        tag.subversions
          .slice()
          .reverse()
          .forEach((subversion) => {
            if (subversion.short_ref !== currentVersion) {
              let vmSubversion = generateElement("li", "vm-subversion");
              let vmSubversionLink = generateElement(
                "a",
                "vm-subversion-link",
                subversion.short_ref
              );
              vmSubversionLink.href = `${window.location.origin}/${subversion.dir}/html/index.html`;
              vmSubversion.appendChild(vmSubversionLink);
              vmSubversions.appendChild(vmSubversion);
            }
          });
        vmOther.appendChild(vmSubversions);
        vmVersions.appendChild(vmOther);
      });
    vmCurrent.appendChild(
      generateElement("span", "vm-current-toggle", `Current: ${currentVersion}`)
    );
    vmVersions.appendChild(vmCurrent);
    vmWrapper.appendChild(vmVersions);
    document.body.appendChild(vmWrapper);
  });

let css = `
  .vm-wrapper {
    position: fixed;
    right: 20px;
    bottom: 30px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.9rem;
  }
  .vm-wrapper ul {
    padding: 0;
    list-style: none;
  }
  .vm-wrapper li {
    list-style: none;
  }
  .vm-other li {
    margin-bottom: 10px;
  }
  .vm-versions {
    text-align: center;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding: 0;
    padding-left: 20px;
  }
  .vm-versions:hover {
    pointer-events: auto;
  }
  .vm-other {
    position: relative;
    display: none;
    min-width: 60px;
    color: #2F3E4E;
    background-color: #F8F9FA;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #dedede;
    margin: 0 10px
  }
  #vm-versions:hover .vm-other, #vm-versions:focus .vm-other, #vm-versions:active .vm-other {
    display: inline-block;
    pointer-events: auto;
  }
  .vm-subversions {
    left: 0;
    right: 0;
    display: none;
    text-align: center;
    position: absolute;
    bottom: 32px;
    min-width: 60px;
  }
  .vm-subversion {
    color: #2F3E4E;
    background-color: #F8F9FA;
    padding: 8px 15px;
    border-radius: 4px;
    border: 1px solid #dedede;
  }
  .vm-subversion-link {
    color: #2F3E4E;
    text-decoration: none;
  }
  .vm-subversion-link:hover {
    color: #3679BE;
    text-decoration: underline;
  }
  #vm-other:hover .vm-subversions, #vm-other:focus .vm-subversions, #vm-other:active .vm-subversions {
    display: block;
    pointer-events: auto;
  }
  .vm-current {
    display: inline-block;
    color: #2F3E4E;
    background-color: #F8F9FA;
    padding: 4px 8px;
    border-radius: 5px;
    border: 1px solid #dedede;
  }
  @media (prefers-color-scheme: dark) {
    .vm-current {
      background-color: #1C1D1F;
      color: #D4DBDE;
      border-color: #38393B;
    }
    .vm-subversion {
      background-color: #1C1D1F;
      color: #D4DBDE;
      border-color: #38393B;
    }
    .vm-other {
      background-color: #1C1D1F;
      color: #D4DBDE;
      border-color: #38393B;
    }

  }
  `;
let style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);
