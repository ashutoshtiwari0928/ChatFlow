package com.chatFlow.ChatApplication.Repository;

import com.chatFlow.ChatApplication.Model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Integer> {
}
