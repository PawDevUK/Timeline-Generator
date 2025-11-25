Time Line Generator

It is package to allow track the changes of selected repositories with use of git changes made by the user. TLG reads what is done in the selected repositories and based on changes, updates, insertions, deletetions generates summary of the work done during the day and then uploads it to the server which then saves it in the DataBase.

## 📚 Documentation

Comprehensive documentation has been created for this project:

- **[SUMMARY.md](SUMMARY.md)** - Start here! Executive summary with recommendations and quick start guide
- **[WORK_REPORT.md](WORK_REPORT.md)** - Detailed project status, completed work, and remaining tasks
- **[IMPLEMENTATION_IDEAS.md](IMPLEMENTATION_IDEAS.md)** - Complete implementation guide with architecture options and code examples
- **[SETUP.md](SETUP.md)** - Step-by-step setup instructions and troubleshooting guide

### Running the App

Two strategies are available for running TLG:

- **[RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md)** - Run as a Next.js app with front-end interface
- **[RUNNING_WITH_GITHUB_ACTIONS.md](RUNNING_WITH_GITHUB_ACTIONS.md)** - Run automated via GitHub Actions

### Quick Links
- Want to understand the project? → Read [SUMMARY.md](SUMMARY.md)
- Ready to build? → Follow [IMPLEMENTATION_IDEAS.md](IMPLEMENTATION_IDEAS.md)
- Need to set up? → Use [SETUP.md](SETUP.md)
- Check progress? → See [WORK_REPORT.md](WORK_REPORT.md)
- Run with Next.js? → See [RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md)
- Run with GitHub Actions? → See [RUNNING_WITH_GITHUB_ACTIONS.md](RUNNING_WITH_GITHUB_ACTIONS.md)

ToDo

**Phase 1: Planning & Decisions**
- [x] Find good name for this package. Time Line Generator
- [ ] Think what stack need to be used.
- [ ] Decide if the chatGPT API will be used to generate the articles or if locally run LLM will be used.
- [ ] Decide which approach will be used to run the app. Not sure if it will be run locally or it will be run on GitHub actions.

**Phase 2: Project Setup**
- [x] Create separate project which will be independent repository.

**Phase 3: Data Structure Design**
- [ ] Create article object structure with all keys which will be used to generate the articles.
- [ ] Create steps to generate an article.

**Phase 4: Backend Development**
- [ ] Create MongoDB schema.
- [ ] Create server route to process received article e.g save in DataBase.
