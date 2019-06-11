class A {
  async create(data: RegisterInput): Promise<User> {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) throw new Error('user already exists');
    const user = await User.create(data).save();
    return user;
  }
}
