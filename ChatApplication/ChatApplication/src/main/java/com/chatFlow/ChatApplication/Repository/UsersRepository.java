package com.chatFlow.ChatApplication.Repository;

import com.chatFlow.ChatApplication.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Integer> {
}
