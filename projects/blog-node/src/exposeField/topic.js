module.exports = {
  select: {
    // offset: true,
    topicId: true,
    topic: {
      select: {
        id: true,
        content: true
      }
    }
  }
}
