Time Line Generator

It is package to allow track the changes of selected repositories with use of git changes made by the user. TLG reads what is done in the selected repositories and based on changes, updates, insertions, deletetions generates summary of the work done during the day and then uploads it to the server which then saves it in the DataBase.

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
